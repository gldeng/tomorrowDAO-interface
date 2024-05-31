export const checkImgSize = (file: File): Promise<boolean> => {
  const reader = new FileReader();
  reader.readAsDataURL(file as Blob);
  return new Promise((resolve) => {
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = function () {
        if (img.width == img.height) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
    };
  });
};
