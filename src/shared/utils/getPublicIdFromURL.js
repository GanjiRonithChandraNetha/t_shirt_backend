export const getPublicIdFromUrl = (url) => {
    console.log(url);
    const parts = url.split('/');

    // Find index of 'upload'
    const uploadIndex = parts.findIndex(p => p === 'upload');

    // Everything after version (v123...) is public_id
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');

    // Remove extension
    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
};