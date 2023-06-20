import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class IdentificationToken {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({
        default: true
    })
    active: string;
}