export function resizeImage(file, targetWidth) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const targetHeight = Math.round(targetWidth * aspectRatio);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        
        // High-quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Export as JPEG with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Canvas export failed");
              return;
            }
            const fileName = `${Date.now()}.jpg`;
            const finalFile = new File([blob], fileName, {
              type: "image/jpeg",
            });

            resolve(finalFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
