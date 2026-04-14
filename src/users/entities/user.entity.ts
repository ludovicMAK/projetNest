import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    userId: number ;
    @Column()
    username: string;
    @Column()
    password: string;


}
