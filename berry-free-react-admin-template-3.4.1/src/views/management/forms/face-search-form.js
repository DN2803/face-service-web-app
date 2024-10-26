import ImageUpload from "ui-component/ImageUpload";

const FaceSearchForm = ({ onSubmit }) => {
    const uploadedImage = null;

    return (
        <>
            <ImageUpload
                handleUpload={onSubmit}
                uploadedImage={uploadedImage}
                sizeAccept={{ width: 800, height: 800 }}
            />
        </>
    )
};
export default FaceSearchForm