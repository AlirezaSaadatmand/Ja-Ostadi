export interface Course {
  id: number
  name: string
  number: string
  group: string
  units: number
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
