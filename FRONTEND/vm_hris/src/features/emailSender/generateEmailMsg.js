export const generateEmailMsg = (
  branch,
  filename,
  info,
  compiledInfo,
  update = false
) => {
  const emailMsg = {
    email: "hero.viamare@gmail.com",
    subject: `${branch} Employee Record ${!update ? "Creation" : "Update"}`,
    message: `Good day,\n\nThis email contains ${
      !update ? "a new" : "an updated"
    } employee record from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
    attachments: [
      {
        filename,
        content: JSON.stringify({
          id: info?.id,
          ...compiledInfo,
        }),
        contentType: "application/json",
      },
    ],
  };

  return emailMsg;
};
