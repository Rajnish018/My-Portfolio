import Router from "express";
import {
  updateAdminProfile,
  changeAdminPassword,
  getDashboard,
  uploadAdminAvatar,
} from "../../controllers/admin.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

import { verifyAdmin } from "../../middlewares/verifyAdmin.middleware.js";
import {
  createCertification,
  deleteCertification,
  updateCertification,
} from "../../controllers/certification.controller.js";
import {
  deleteMessage,
  getAllMessages,
  getUnreadMessageCount,
  markMessageRead,
} from "../../controllers/contact.controller.js";
import { getDashboardSummary } from "../../controllers/dasboard.controller.js";
import {
  createEducation,
  deleteEducation,
  getAllEducation,
  updateEducation,
} from "../../controllers/education.controller.js";
import {
  createProject,
  deleteProject,
  getAllArchivedAndFeatured,
  projectIsArchived,
  updateProject,
  uploadProjectImage,
} from "../../controllers/project.controller.js";
import {
  createSkill,
  deleteSkill,
  updateSkill,
} from "../../controllers/skill.controller.js";

const router = Router();

router.use(verifyAdmin)

/*------------------------------------------Admin ROUTE----------------------------------------------------------*/

router.route("/profile").patch(updateAdminProfile);

router.route("/change-password").post(changeAdminPassword);
router.route("/dashboard").get(getDashboard);
router.route("/upload-avatar").post(upload.single("avatar"), uploadAdminAvatar);

/*------------------------------------------Admin ROUTE----------------------------------------------------------*/
router.route("/certifications").post(createCertification);

router
  .route("/certifications/:id")
  .patch(updateCertification)
  .delete(deleteCertification);

/*------------------------------------------Admin ROUTE----------------------------------------------------------*/
router.route("/messages").get(getAllMessages);
router.route("/messages/:id/read").patch(markMessageRead);
router.route("/messages/:id").delete(deleteMessage);
router.route("/messages/unread-count").get(getUnreadMessageCount);

router.route("/dashboard/summary").get(getDashboardSummary);

router.route("/education").get(getAllEducation).post(createEducation);

router.route("/education/:id").patch(updateEducation).delete(deleteEducation);

router.route("/projects").post(upload.single("image"), createProject);


router.route("/upload-project-image").post(upload.single("image"),uploadProjectImage)


router
  .route("/projects/:id")
  .patch(upload.single("image"), updateProject)
  .delete(deleteProject);

router.route("/projects/:id/archive").patch(projectIsArchived);

router.route("/projects/archived-featured").get(getAllArchivedAndFeatured);

router.route("/skills").post(createSkill);

router.route("/skills/:id").patch(updateSkill).delete(deleteSkill);

export default router;
