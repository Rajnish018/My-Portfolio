import Router from 'express'
import { getAdminProfile, loginAdmin } from '../../controllers/admin.controller.js';
import { getAllCertifications } from '../../controllers/certification.controller.js';
import { createContact } from '../../controllers/contact.controller.js';
import { getAllEducation } from '../../controllers/education.controller.js';
import { getAllProjects } from '../../controllers/project.controller.js';
import { getAllSkill } from '../../controllers/skill.controller.js';



const router =Router()

/*------------------------------------------Admin ROUTE----------------------------------------------------------*/

router.route("/profile").get(getAdminProfile)
router.route("/login").post(loginAdmin)

/*----------------------------------------Certificate ROUTE-------------------------------------------------------*/

router.route("/certifications").get(getAllCertifications)


router.route("/contacts").post(createContact)


router.route("/education").get(getAllEducation)


router.route("/projects").get(getAllProjects)

router.route("/skills").get(getAllSkill)



export default router;
