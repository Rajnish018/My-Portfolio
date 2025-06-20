import { Project } from "../model/project.model.js";
import { Contact } from "../model/contactmessage.model.js";
import { Skill } from "../model/skill.model.js";
import { ApiError } from "../services/ApiError.js";
import { ApiRespose } from "../services/ApiResponse.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const [
      projectData,
      messageData,
      skillsData
    ] = await Promise.all([
      // Project data with all required fields
      Project.aggregate([
        {
          $facet: {
            projectCount: [
              { $count: "totalProjects" }
            ],
            recentCreated: [
              { $sort: { createdAt: -1 } },
              { $limit: 6 },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  image:1,
                  techStack: 1,
                  thumbnail: 1,
                  createdAt: 1,
                  updatedAt: 1
                }
              }
            ],
            recentUpdated: [
              { $sort: { updatedAt: -1 } },
              { $limit: 6 },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  image:1,
                  techStack: 1,
                  thumbnail: 1,
                  createdAt: 1,
                  updatedAt: 1
                }
              }
            ]
          }
        }
      ]),

      // Message data
      Contact.aggregate([
        {
          $facet: {
            unreadCount: [
              { $match: { isRead: false } },
              { $count: "unreadMessages" }
            ]
          }
        }
      ]),

      // Skills data with null handling
      Skill.aggregate([
        { 
          $group: { 
            _id: { 
              $ifNull: ["$category", "Uncategorized"] 
            }, 
            value: { $sum: 1 } 
          } 
        },
        { 
          $project: { 
            _id: 0, 
            name: "$_id", 
            value: 1 
          } 
        },
        { $sort: { value: -1 } }
      ])
    ]);

    // Unpack results with safe defaults
    const projectCount = projectData[0]?.projectCount[0]?.totalProjects || 0;
    const recentCreated = projectData[0]?.recentCreated || [];
    const recentUpdated = projectData[0]?.recentUpdated || [];
    
    const unreadMessages = messageData[0]?.unreadCount[0]?.unreadMessages || 0;
    
    const skillsDistribution = skillsData || [];
    const totalSkills = skillsDistribution.reduce((sum, skill) => sum + skill.value, 0);

    res.status(200).json(new ApiRespose(200, {
      // Core metrics
      totalProjects: projectCount,
      unreadMessages: unreadMessages,
      totalSkills: totalSkills,
      
      // Skills data
      skillsDistribution: skillsDistribution,
      
      // Recent projects with all fields
      recentProjectsCreated: recentCreated,
      recentProjectsUpdated: recentUpdated
    }));
    
  } catch (err) {
    console.error("Dashboard summary error →", err);
    res
      .status(500)
      .json(new ApiError(500, "Failed to fetch dashboard summary"));
  }
};