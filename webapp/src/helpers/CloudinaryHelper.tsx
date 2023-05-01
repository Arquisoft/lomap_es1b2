
const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const preset = process.env.REACT_APP_PRESET;


export const fileUpload = async (file: File): Promise<string | undefined> => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`

    const formData = new FormData();
    formData.append('upload_preset', `${"lmap_es1b2"}`)
    formData.append('file', file);

    try {
        const res = await fetch(cloudinaryUrl, {
            method: 'POST',
            headers: {
                "X-CSRF-Token": process.env.REACT_APP_API_KEY! 
            },
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok) console.error(data)

        return data.url;

    } catch (error) {
        // console.error(error);
        console.error("Error uploading the file: " + file.name)
    }
};

