import { OUTLET_EMAILS } from "../../config/outletEmailOptions";

export const generateEmailMsg = (
  branch,
  filename,
  id = "",
  compiledInfo,
  update = false
) => {
  let content = update
    ? {
        id: id,
        ...compiledInfo,
      }
    : {
        ...compiledInfo,
      };

  let emails = "";

  // Generate email for HR dept
  if (branch !== "Head Office") {
    console.log(OUTLET_EMAILS[compiledInfo.AssignedOutlet].join(", "));
    emails = /* OUTLET_EMAILS["Head Office"] */ "hero.viamare@gmail.com";
  } else {
    if (Array.isArray(OUTLET_EMAILS[compiledInfo.AssignedOutlet])) {
      emails = OUTLET_EMAILS[compiledInfo.AssignedOutlet].join(",");
    } else {
      emails = OUTLET_EMAILS[compiledInfo.AssignedOutlet];
    }
    /* return {
      email: emails,
      subject: `${branch} Employee Record Modification`,
      message: `Good day,\n\nThis email contains new/modified employee record from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
      attachments: [
        {
          filename,
          content: JSON.stringify(content),
          contentType: "application/json",
        },
      ],
    }; */
  }

  return {
    email: emails,
    subject: `${branch} Employee Record Modification`,
    message: `Good day,\n\nThis email contains new/modified employee record from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
    attachments: [
      {
        filename,
        content: JSON.stringify(content),
        contentType: "application/json",
      },
    ],
  };
};
