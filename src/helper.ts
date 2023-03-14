export default {
    isImage: (name: string) => {
        return name.match(/\.(jpg|jpeg|png|gif)$/i);
    }
}
