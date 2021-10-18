export const upload = async (dateUrlFile, system, folder) => {
  console.log(folder, !!folder)
  const file = await (await fetch(dateUrlFile)).blob();
  const formData = new FormData();
  const filename = `firma-${Date.now()}.svg`;
  formData.append("title", filename);
  formData.append("type", "image/svg+xml");
  formData.append("filename_disk", filename);
  if(folder){
    formData.append("folder", folder);
  }
  formData.append("file", file);
  try {
    const response = await system.api.post(`/files`, formData);
    return response.data.data;
  } catch (error) {
    const store = system.useNotificationsStore();

    const code =
      error.response?.data?.errors?.[0]?.extensions?.code ||
      error?.extensions?.code ||
      "UNKNOWN";

    const message =
      error.response?.data?.errors?.[0]?.message || error.message || undefined;

    console.warn(error);

    store.add({
      title: `errors.${code}`,
      text: message,
      type: "error",
      dialog: true,
      error,
    });
  }
};

export function getRootPath() {
	const path = window.location.pathname;
	const parts = path.split('/');
	const adminIndex = parts.indexOf('admin');
	const rootPath = parts.slice(0, adminIndex).join('/') + '/';
	return rootPath;
}