import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Timestamp, ManyToOne, JoinColumn, OneToOne, OneToMany} from 'typeorm'
import { Role } from './Role';
import { Counter } from './Counter';
import { Issue } from './Issue';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    userId: number;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'int' })
    roleId: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToOne(() => Counter)
    counter: Counter;

    @OneToMany(() => Issue, issue => issue.issue)
    issues: Issue[];

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
    })
    created_on: Date;
    
    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updated_on: Date;
}