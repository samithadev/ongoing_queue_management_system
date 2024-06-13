import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Timestamp, ManyToOne, JoinColumn, OneToOne, OneToMany} from 'typeorm'
import { User } from './User';
import { Issue } from './Issue';

@Entity()
export class Counter {
    @PrimaryGeneratedColumn({ type: 'int' })
    counterId: number;

    @Column({ type: 'varchar', length: 255 })
    counterName: string;

    @Column({ type: 'int', nullable: true  })
    assignUser: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'assignUser' })
    user: User | null;

    @OneToMany(() => Issue, issue => issue.counter)
    issues: Issue[];

    @Column({
        type: "varchar",
        length: 10,
        default: "offline",
    })
    status: string;

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