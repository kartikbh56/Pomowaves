/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react"
import { useState } from "react"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  StickyNote,
  Sun,
  SunMedium,
  Moon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react"
import { fetchTimeline, initialFetchTimeline, updateTimeline } from "../backend/db"
import { getFocusDuration } from "../utils/formatDate"
import { useReportsStore } from "../store/useReportsStore"

const getTimeIcon = (date) => {
  const hour = new Date(date).getHours()
  if (hour >= 6 && hour < 12) return <Sun className="h-4 w-4" />
  if (hour >= 12 && hour < 18) return <SunMedium className="h-4 w-4" />
  if (hour >= 18 && hour <= 23) return <Moon className="h-4 w-4" />
  return <Moon className="h-4 w-4" />
}

const getTimePeriod = (date) => {
  const hour = new Date(date).getHours()
  if (hour >= 6 && hour < 12) return "Morning"
  if (hour >= 12 && hour < 18) return "Afternoon"
  if (hour >= 18 && hour <= 23) return "Evening"
  return "Midnight"
}

const MobileTimesheetCard = ({ row, onEdit, onDelete, onViewNote }) => (
  <div className="border rounded-lg p-4 space-y-3 bg-card">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-medium">{format(new Date(row.original.startedAt), "MMM dd, yyyy")}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getTimeIcon(row.original.startedAt)}
            <span className="font-mono">
              {format(new Date(row.original.startedAt), "h:mm a")} - {format(new Date(row.original.endedAt), "h:mm a")}
            </span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive cursor-pointer focus:text-destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="space-y-2">
      <p className="font-medium">{row.original.task}</p>
      {row.original.note && <p className="text-sm text-muted-foreground line-clamp-2">{row.original.note}</p>}
    </div>

    <div className="flex items-center justify-between">
      <Badge variant="secondary" className="font-mono">
        {getFocusDuration(row.original.startedAt, row.original.endedAt)}
      </Badge>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewNote(row.original)}>
        <StickyNote className={`h-4 w-4 ${row.original.note?.trim() ? "text-foreground" : "text-muted-foreground"}`} />
      </Button>
    </div>
  </div>
)

export default function TimesheetTable() {
  const [editingTask, setEditingTask] = useState(null)
  const [viewingNote, setViewingNote] = useState(null)
  const deleteTimeline = useReportsStore((state) => state.deleteTimeline)
  const queryClient = useQueryClient()

  // Pagination state
  const [limit] = useState(9)
  const [lastId, setLastId] = useState(null)
  const [cursorStack, setCursorStack] = useState([]) // to support going back

  const { data, isLoading } = useQuery({
    queryKey: ["timesheet", lastId],
    queryFn: () => (lastId ? fetchTimeline(limit, lastId) : initialFetchTimeline(limit)),
    keepPreviousData: true,
    refetchOnMount: "always",
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (doc) => deleteTimeline(doc),
    onSuccess: () => {
      queryClient.invalidateQueries(["timesheet"])
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ documentId, modification }) => updateTimeline(documentId, modification),
    onSuccess: () => {
      queryClient.invalidateQueries(["timesheet"])
    },
  })

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "startedAt",
        header: "Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col font-mono">
              <span className="font-medium">{format(new Date(row.original.startedAt), "MMM dd")}</span>
              <span className="text-xs text-muted-foreground">{format(new Date(row.original.startedAt), "yyyy")}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "timeRange",
        header: "Time",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {getTimeIcon(row.original.startedAt)}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-medium">
                {format(new Date(row.original.startedAt), "h:mm a")} -{" "}
                {format(new Date(row.original.endedAt), "h:mm a")}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{getTimePeriod(row.original.startedAt)}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "task",
        header: "Task",
        cell: ({ row }) => (
          <div className="max-w-[200px] lg:max-w-[300px]">
            <p className="font-medium truncate">{row.original.task}</p>
            {row.original.note && <p className="text-xs text-muted-foreground mt-1 truncate">{row.original.note}</p>}
          </div>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono">
            {getFocusDuration(row.original.startedAt, row.original.endedAt)}
          </Badge>
        ),
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setViewingNote(row.original)}>
            <StickyNote
              className={`h-4 w-4 ${row.original.note?.trim() ? "text-foreground" : "text-muted-foreground"}`}
            />
          </Button>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setEditingTask(row.original)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer focus:text-destructive"
                onClick={() => deleteMutation.mutate(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: data?.documents ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // handled via Appwrite cursor
  })

  // Handle pagination forward
  const handleNext = () => {
    if (data?.documents?.length) {
      const lastDocId = data.documents[data.documents.length - 1].$id
      setCursorStack((prev) => [...prev, lastId])
      setLastId(lastDocId)
    }
  }

  // Handle pagination backward
  const handlePrevious = () => {
    if (cursorStack.length > 0) {
      const prevCursor = cursorStack[cursorStack.length - 1]
      setCursorStack((prev) => prev.slice(0, -1))
      setLastId(prevCursor || null)
    }
  }

  const startIndex = cursorStack.length * limit + 1
  const endIndex = startIndex + (data?.documents?.length || 0) - 1

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Timesheet</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track and manage your work sessions with detailed insights
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`bg-muted/50 font-semibold h-14 px-4 lg:px-6 ${
                        // Hide time column on medium screens, show on large
                        index === 1 ? "hidden lg:table-cell" : ""
                      } ${
                        // Hide note column on medium screens
                        index === 4 ? "hidden lg:table-cell" : ""
                      }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 lg:px-6 py-4">
                        <div className="max-w-[200px] lg:max-w-[300px] space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 lg:px-6 py-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-4 lg:px-6 py-4">
                        <Skeleton className="h-9 w-9 rounded" />
                      </TableCell>
                      <TableCell className="px-4 lg:px-6 py-4">
                        <Skeleton className="h-9 w-9 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`px-4 lg:px-6 py-4 ${
                          // Hide time column on medium screens, show on large
                          index === 1 ? "hidden lg:table-cell" : ""
                        } ${
                          // Hide note column on medium screens
                          index === 4 ? "hidden lg:table-cell" : ""
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <p className="font-medium">No timesheet entries found</p>
                      <p className="text-sm">Start tracking your time to see entries here</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* small screen view */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </>
        ) : table.getRowModel().rows.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <MobileTimesheetCard
                key={row.id}
                row={row}
                onEdit={setEditingTask}
                onDelete={deleteMutation.mutate}
                onViewNote={setViewingNote}
              />
            ))
        ) : (
          <div className="border rounded-lg p-8 text-center bg-card">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Clock className="h-8 w-8 opacity-50" />
              <p className="font-medium">No timesheet entries found</p>
              <p className="text-sm">Start tracking your time to see entries here</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 gap-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {data?.documents?.length ? (
            <>
              Showing <span className="font-medium text-foreground">{startIndex}</span> to{" "}
              <span className="font-medium text-foreground">{endIndex}</span> of{" "}
              <span className="font-medium text-foreground">{data?.total || 0}</span> entries
            </>
          ) : (
            "No entries to display"
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={cursorStack.length === 0}
            className="h-9 px-3 gap-1 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!data?.documents?.length || data.documents.length < limit}
            className="h-9 px-3 gap-1 bg-transparent"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Session Note
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {viewingNote?.note?.trim() ? (
              <div className="rounded-lg bg-muted p-4 border">
                <p className="leading-relaxed text-sm sm:text-base">{viewingNote.note}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No note available for this entry</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-lg mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit 
            </DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="task-name" className="text-sm font-medium">
                  Task Name
                </Label>
                <Input
                  id="task-name"
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                  className="h-10"
                  placeholder="Enter task description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-note" className="text-sm font-medium">
                  Note
                </Label>
                <Textarea
                  id="task-note"
                  placeholder="Add additional details or notes..."
                  value={editingTask.note || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, note: e.target.value })}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditingTask(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateMutation.mutate({
                  documentId: editingTask.$id,
                  modification: {
                    task: editingTask.task,
                    note: editingTask.note,
                  },
                })
                setEditingTask(null)
              }}
              disabled={updateMutation.isLoading}
              className="w-full sm:w-auto"
            >
              {updateMutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
