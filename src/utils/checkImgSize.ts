export const checkImgSize = (file: File): Promise<boolean> => {
  const reader = new FileReader();
  reader.readAsDataURL(file as Blob);
  return new Promise((resolve) => {
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = function () {
        const Width = 512;
        const Height = 512;
        if (img.width !== Width || img.height !== Height) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
    };
  });
};
