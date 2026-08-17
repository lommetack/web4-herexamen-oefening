// app/routes/create.jsx
import { PlusSquare } from "lucide-react";

// React Aria imports
import { Button, FileTrigger, TextField } from "react-aria-components";
import { Form } from "react-router";

export const clientAction = async () => {
  // Handle the form submission (would connect to backend in real app)
  // const formData = await request.formData();
  // Process the data
  return null;
};

export default function Create() {
  return (
    <div className="create-page">
      <h2>Create New Post</h2>
      <Form method="post" encType="multipart/form-data" className="create-form">
        <div className="upload-container">
          <PlusSquare size={48} />
          <p>Upload a photo</p>
        </div>

        <FileTrigger name="photo" className="file-trigger">
          <Button className="file-select-button">Select File</Button>
        </FileTrigger>

        <TextField className="text-field">
          {({ inputProps }) => (
            <>
              <input
                {...inputProps}
                name="caption"
                placeholder="Write a caption..."
                className="caption-input"
              />
            </>
          )}
        </TextField>

        <Button type="submit" className="share-button">
          Share
        </Button>
      </Form>
    </div>
  );
}
