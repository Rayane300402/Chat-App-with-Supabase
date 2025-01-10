export interface Ichat {
    created_at: string;
    editable: string;
    id: string;
    sender: string;
    text: string;
    image_url: string;
    users: {
        avatar_url: string;
        id: string;
        full_name: string;
    }
}