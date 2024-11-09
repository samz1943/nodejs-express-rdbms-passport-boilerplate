import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  post_id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.posts, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
