import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Timestamp, ManyToOne, JoinColumn, OneToOne} from 'typeorm'
import { Counter } from './Counter';
import { User } from './User';

export enum Status {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

export enum IssueStatus {
    CANCEL = 'cancel',
    DONE = 'done',
    PENDING = 'pending'
}

@Entity()
export class Issue {
    @PrimaryGeneratedColumn({ type: 'int' })
    issueId: number;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'int' })
    counterId: number;

    @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.PENDING })
    issueStatus: IssueStatus;

    @Column({ type: 'enum', enum: Status, default: Status.ONLINE })
    status: Status;

    @Column({ type: 'int', nullable: true})
    tokenNo: number | null;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 20 })
    phoneNo: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'text'})
    issue: string;

    @ManyToOne(() => User, user => user.issues)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Counter, counter => counter.issues)
    @JoinColumn({ name: 'counterId' })
    counter: Counter;

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