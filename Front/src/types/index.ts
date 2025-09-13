export interface Course {
  id: number
  name: string
  number: string
  group: string
  units: string
  semester_id: number
  department_id: number
  instructor_id: number
}

export interface Instructor {
  name: string
}

export interface CourseTime {
  day: string
  start_time: string
  end_time: string
  room: string
}

export interface CourseResponse {
  course: Course
  instructor: Instructor
  time: CourseTime[]
  department: {
    name: string
  }
}

export interface Department {
  id: number
  name: string
}

export interface DepartmentDetail {
  id: number
  name: string
  instructors_count: number
  courses_count: number
}

export interface InstructorListItem {
  instructor: {
    name: string
    field: string
  }
  relations: {
    instructor_id: number
    department_id: number
    semester_id: number
  }
}

export interface InstructorDetail {
  id: number
  name: string
  email: string
  office_location: string
  office_hours: string
  departments: { id: number; name: string }[]
  courses: { id: number; name: string; semester_id: number; department_id: number }[]
}

export interface Semester {
  id: number
  name: string
}

export interface CourseInSemester {
  id: number
  name: string
}

export interface InstructorCoursesBySemester {
  semester: {
    id: number
    name: string
  }
  courses: CourseInSemester[]
}

export interface CourseInList {
  ID: number
  CourseName: string
  InstructorName: string
}


export interface CourseDetailCourse {
  id: number
  name: string
  number: string
  group: string
  units: string
  class_type: string
  time_in_week: string
  final_exam_time: string
  final_exam_date: string
  capacity: string
  student_count: string
  semester_id: number
  department_id: number
  instructor_id: number
}

export interface CourseDetailInstructor {
  id: number
  name: string
  field: string
}

export interface CourseDetailDepartment {
  id: number
  name: string
}

export interface CourseDetailClassTime {
  day: string
  start_time: string
  end_time: string
  room: string
}

export interface CourseDetailSemester {
  id: number
  name: string
}

export interface CourseDetailResponseData {
  Course: CourseDetailCourse
  Instructor: CourseDetailInstructor
  Department: CourseDetailDepartment
  ClassTime: CourseDetailClassTime[]
  Semeter: CourseDetailSemester
}
