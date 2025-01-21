import { deleteUser, getUser, updateUser } from "@/controllers/userController";

export const GET = getUser;
export const PATCH = updateUser;
export const DELETE = deleteUser;