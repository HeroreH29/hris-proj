// eslint-disable-next-line
import { OUTLET_EMAILS } from "../../config/outletEmailOptions";

export const generateEmailMsg = ({
  branch = "",
  filename = "",
  id = "",
  compiledInfo = {},
  update = false,
  assignedOutlet = "",
}) => {
  let content = update
    ? {
        id: id,
        ...compiledInfo,
      }
    : {
        ...compiledInfo,
      };

  let emails = "";
  let subj = `${branch} Employee Record Modification`;
  let msg = `Good day,\n\nThis email contains new/modified employee record from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`;

  // Generate email for HR dept
  if (branch !== "Head Office") {
    console.log("outlet has modified a record");
    emails = /* OUTLET_EMAILS["Head Office"] */ OUTLET_EMAILS.admin;
  } else {
    if (Array.isArray(OUTLET_EMAILS[compiledInfo.AssignedOutlet])) {
      emails =
        /* OUTLET_EMAILS[compiledInfo.AssignedOutlet].join(",") */ OUTLET_EMAILS.admin;
    } else {
      emails =
        /* OUTLET_EMAILS[compiledInfo.AssignedOutlet] */ OUTLET_EMAILS.admin;
    }

    subj = "Outlet Record Modification";
    msg = `Good day,\n\nThis email contains new/modified employee record for '${assignedOutlet}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`;
  }

  return {
    email: emails,
    subject: subj,
    message: msg,
    attachments: [
      {
        filename,
        content: JSON.stringify(content),
        contentType: "application/json",
      },
    ],
  };
};
