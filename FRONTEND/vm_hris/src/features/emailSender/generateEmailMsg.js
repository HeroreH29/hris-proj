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
  const emailMsg = {
    email: "hero.viamare@gmail.com",
    subject: `${branch} Employee Record Modification`,
    message: `Good day,\n\nThis email contains modified employee record from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
    attachments: [
      {
        filename,
        content: JSON.stringify(content),
        contentType: "application/json",
      },
    ],
  };

  return emailMsg;
};
