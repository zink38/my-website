import { RowDataPacket } from 'mysql2';
import { SelectQuery, ModifyQuery } from '../db/queries.js';


export interface IJobRow extends RowDataPacket {
  id: number;
  title: string;
  location: string;
  salary: string;
  posted: string;
}

export class JobModel {
    static async getAllJobs() {
        return SelectQuery<IJobRow>('SELECT * FROM jobs;');
    }

    static async getJobById(id: number) {
        return SelectQuery<IJobRow>('SELECT * FROM jobs WHERE id = ?;', [id]);
    }

    static async createJob(title: string, location: string, salary: string, posted: string) {
        const queryString = 'INSERT INTO jobs (title, location, salary, posted) VALUE (?, ?, ?, ?);';
        return ModifyQuery(queryString, [title, location, salary, posted]);
    }

    static async updateJob(id: number, jobData: Partial<IJobRow>) {
        return ModifyQuery(`UPDATE jobs SET title = '${jobData.title}', location = '${jobData.location}', salary = '${jobData.salary}', posted = '${jobData.posted}' WHERE id = ${id};`);
    }

    static async deleteJob(id: number) {
        return ModifyQuery(`DELETE FROM jobs WHERE id = ${id};`);
    }
}
