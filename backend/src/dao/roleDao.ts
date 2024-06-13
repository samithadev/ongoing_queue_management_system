import connectDB from "../typeorm";
import { Role } from "../entities/Role";

export const RoleDAO = {
    createRole: async (roleDetails: Partial<Role>): Promise<Role> => {
        const roleRepository = connectDB.getRepository(Role);
        const newRole = roleRepository.create(roleDetails);
        return await roleRepository.save(newRole);
    },

    getAllRoles: async (): Promise<Role[]> => {
        const roleRepository = connectDB.getRepository(Role);
        return await roleRepository.find();
    },

    updateRole: async (roleDetails: { id: number } & Partial<Role>): Promise<Role | null> => {
        const { id, ...updateData } = roleDetails;
        const roleRepository = connectDB.getRepository(Role);
        const role = await roleRepository.findOne({
            where: { roleId: id }
        });

        if (!role) return null;

        roleRepository.merge(role, updateData);
        return await roleRepository.save(role);
    },


    deleteRole: async (id: number): Promise<boolean> => {
        const roleRepository = connectDB.getRepository(Role);
        const role = await roleRepository.findOne({
            where: { roleId: id }
        });

        if (!role) return false;

        await roleRepository.remove(role);
        return true;
    }
};
