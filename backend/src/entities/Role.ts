import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from 'typeorm'
import { User } from './User';

@Entity()
export class Role {
    @PrimaryGeneratedColumn({ type: 'int' })
    roleId: number;

    @Column({ type: 'varchar', length: 255 })
    role: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}