export const redirectToLoginPage = () => {
  window.location.replace('/login');
};

export const getSubdirectoryURL = (): string => {
  const url = window.location.href;
  const parts = url.split('/'); // Results: ['http:', '', 'example.com', '']
  const subDirectory = parts[3]; // Get subdirectory url only
  const index = subDirectory.indexOf('?'); // Remove query behind subDirectory

  if (index !== -1) {
    return subDirectory.substring(0, index);
  }

  return subDirectory;
};
