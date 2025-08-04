import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

/**
 * Fetches all submissions for a specific blueprint task
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @returns Promise resolving to array of submissions
 */
export async function getBlueprintTaskSubmissions(blueprintId: string, taskId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("blueprint_submissions")
      .select(`
        *,
        users:user_id (
          id,
          email,
          name
        )
      `)
      .eq("blueprint_id", blueprintId)
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blueprint task submissions:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getBlueprintTaskSubmissions:", error)
    throw error
  }
}

/**
 * Fetches all submissions for a specific user in a blueprint
 * @param blueprintId Blueprint ID
 * @param userId User ID
 * @returns Promise resolving to array of submissions
 */
export async function getUserBlueprintSubmissions(blueprintId: string, userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("blueprint_submissions")
      .select(`
        *,
        tasks:task_id (
          id,
          title,
          description,
          order
        )
      `)
      .eq("blueprint_id", blueprintId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user blueprint submissions:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserBlueprintSubmissions:", error)
    throw error
  }
}

/**
 * Creates a new submission for a blueprint task
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @param userId User ID
 * @param content Submission content
 * @param fileUrl Optional file URL for the submission
 * @returns Promise resolving to created submission
 */
export async function createBlueprintSubmission(
  blueprintId: string,
  taskId: string,
  userId: string,
  content: string,
  fileUrl?: string,
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const submission = {
      blueprint_id: blueprintId,
      task_id: taskId,
      user_id: userId,
      content,
      file_url: fileUrl || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("blueprint_submissions").insert(submission).select().single()

    if (error) {
      console.error("Error creating blueprint submission:", error)
      throw error
    }

    // Mark the task as completed
    await markTaskAsCompleted(blueprintId, taskId, userId)

    return data
  } catch (error) {
    console.error("Error in createBlueprintSubmission:", error)
    throw error
  }
}

/**
 * Marks a task as completed for a user
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @param userId User ID
 * @returns Promise resolving to operation result
 */
export async function markTaskAsCompleted(blueprintId: string, taskId: string, userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if the task is already completed
    const { data: existingCompletion, error: checkError } = await supabase
      .from("blueprint_task_completions")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .eq("task_id", taskId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking task completion:", checkError)
      throw checkError
    }

    // If already completed, return the existing completion
    if (existingCompletion) {
      return existingCompletion
    }

    // Otherwise, create a new completion record
    const completion = {
      blueprint_id: blueprintId,
      task_id: taskId,
      user_id: userId,
      completed_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("blueprint_task_completions").insert(completion).select().single()

    if (error) {
      console.error("Error marking task as completed:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in markTaskAsCompleted:", error)
    throw error
  }
}

/**
 * Gets all completed tasks for a user in a blueprint
 * @param blueprintId Blueprint ID
 * @param userId User ID
 * @returns Promise resolving to array of completed task IDs
 */
export async function getCompletedTasks(blueprintId: string, userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("blueprint_task_completions")
      .select("task_id")
      .eq("blueprint_id", blueprintId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching completed tasks:", error)
      throw error
    }

    return data?.map((item) => item.task_id) || []
  } catch (error) {
    console.error("Error in getCompletedTasks:", error)
    throw error
  }
}

/**
 * Gets completion statistics for a blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to completion statistics
 */
export async function getBlueprintCompletionStats(blueprintId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get total number of tasks in the blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("id")
      .eq("blueprint_id", blueprintId)

    if (tasksError) {
      console.error("Error fetching blueprint tasks:", tasksError)
      throw tasksError
    }

    const totalTasks = tasks?.length || 0

    // Get all enrollments for the blueprint
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("blueprint_enrollments")
      .select("user_id")
      .eq("blueprint_id", blueprintId)

    if (enrollmentsError) {
      console.error("Error fetching blueprint enrollments:", enrollmentsError)
      throw enrollmentsError
    }

    const totalEnrollments = enrollments?.length || 0

    // Get all task completions for the blueprint
    const { data: completions, error: completionsError } = await supabase
      .from("blueprint_task_completions")
      .select("user_id, task_id")
      .eq("blueprint_id", blueprintId)

    if (completionsError) {
      console.error("Error fetching blueprint completions:", completionsError)
      throw completionsError
    }

    // Calculate statistics
    const userCompletions: Record<string, string[]> = {}
    completions?.forEach((completion) => {
      if (!userCompletions[completion.user_id]) {
        userCompletions[completion.user_id] = []
      }
      userCompletions[completion.user_id].push(completion.task_id)
    })

    const usersWithCompletions = Object.keys(userCompletions).length
    const fullyCompletedUsers = Object.values(userCompletions).filter((tasks) => tasks.length === totalTasks).length

    const totalCompletions = completions?.length || 0
    const possibleCompletions = totalEnrollments * totalTasks
    const completionRate = possibleCompletions > 0 ? (totalCompletions / possibleCompletions) * 100 : 0

    return {
      totalTasks,
      totalEnrollments,
      totalCompletions,
      usersWithCompletions,
      fullyCompletedUsers,
      completionRate: Math.round(completionRate),
      possibleCompletions,
    }
  } catch (error) {
    console.error("Error in getBlueprintCompletionStats:", error)
    throw error
  }
}

/**
 * Gets task completion statistics for a blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to task completion statistics
 */
export async function getTaskCompletionStats(blueprintId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get all tasks in the blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("id, title, order")
      .eq("blueprint_id", blueprintId)
      .order("order")

    if (tasksError) {
      console.error("Error fetching blueprint tasks:", tasksError)
      throw tasksError
    }

    // Get total number of enrollments
    const { count: totalEnrollments, error: enrollmentsError } = await supabase
      .from("blueprint_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("blueprint_id", blueprintId)

    if (enrollmentsError) {
      console.error("Error counting blueprint enrollments:", enrollmentsError)
      throw enrollmentsError
    }

    // Get completion counts for each task
    const taskStats = await Promise.all(
      tasks.map(async (task) => {
        const { count, error } = await supabase
          .from("blueprint_task_completions")
          .select("*", { count: "exact", head: true })
          .eq("blueprint_id", blueprintId)
          .eq("task_id", task.id)

        if (error) {
          console.error(`Error counting completions for task ${task.id}:`, error)
          throw error
        }

        const completionRate = totalEnrollments > 0 ? (count / totalEnrollments) * 100 : 0

        return {
          id: task.id,
          title: task.title,
          order: task.order,
          completions: count,
          completionRate: Math.round(completionRate),
        }
      }),
    )

    return {
      tasks: taskStats,
      totalEnrollments: totalEnrollments || 0,
    }
  } catch (error) {
    console.error("Error in getTaskCompletionStats:", error)
    throw error
  }
}
