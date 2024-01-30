/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: 'active' | 'inactive'; // Two possible status for a class
  semester: string;
}

export interface IAssignment {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}

export interface IGrades {
  classId: string;
  grades: { [key : string]: number }; // Grades stored as a key-value pair: assignmentId as key and grade as value
  name: string;
  studentId: string;
}

export interface IStudent {
  dateEnrolled: string;
  name: string;
  status: 'enrolled' | 'graduated' | 'other'; // All possible statuses 
  universityId: string;
}

export interface IGradeTableProps {
  grades: { studentId: string; studentName: string; finalGrade: number }[];
}