import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'travelee', 
  api_key: '884793152861746', 
  api_secret: '-UjW9F9RS7Syyz6crou5_otGggg' 
});

export default cloudinary;

// Helper function to upload image to Cloudinary
export const uploadImage = async (file: string): Promise<string> => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'techno-club/events',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}; 