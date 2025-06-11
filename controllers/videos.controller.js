const videoFile = req.file.path;

const extension = videoFileFile.split('.').pop();
const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg', 'MP'];

if (!extensionesPermitidas.includes(extension)) {
    console.error('Extensión de archivo no permitida');
    return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, JPG y MP4');
}