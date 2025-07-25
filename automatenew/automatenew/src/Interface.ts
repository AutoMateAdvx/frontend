export interface Level {
    id: number,
    order_number: number,
    title: string
}
export interface Course {
    description: string,
    id: number,
    image_url: string,
    levels: Level[],
    tag: string,
    title: string
}


export interface CurrentLevel {
    content: LevelContent,
    course: CourseContent,
    course_id: number,
    created_at: Date,
    description: string,
    id: number,
    order_number: number,
    requirements: string,
    title: string,
    updated_at: Date

}
export interface LevelContent {
    examples: string[],
}
export interface CourseContent {
    id: number,
    tag: string,
    title: string,
}

export interface CourseLevel {
    id: number,
    title: string, 
    order_number: number
}
export interface CurrentCourse {
    id: number,
    title: string,
    tag: string,
    description: string,
    git_url: string,
    image_url: string,
    created_at: Date,
    updated_at: Date,
    levels: CourseLevel[]
}
