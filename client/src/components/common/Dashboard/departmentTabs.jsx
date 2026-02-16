import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSelector, useDispatch } from "react-redux"
import { HandleDeleteHRDepartments, HandleGetHRDepartments, HandlePatchHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk"
import { Loading } from "../loading.jsx"
import { HeadingBar } from "./ListDesigns.jsx"
import { DepartmentListItems } from "./ListDesigns.jsx"
import { useToast } from "../../../hooks/use-toast.js"
import { EmployeesIDSDialogBox } from "./dialogboxes.jsx"



export const HRDepartmentTabs = () => {
    const { toast } = useToast()
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    const dispatch = useDispatch()
    const [department, setdepartment] = useState("All Departments")

    const departments = []

    if (Array.isArray(HRDepartmentState.data)) {
        for (let index = 0; index < HRDepartmentState.data.length; index++) {
            departments.push({
                value: HRDepartmentState.data[index].name,
                label: HRDepartmentState.data[index].name
            })
        }
    }

    const selectedDepartment = HRDepartmentState.data
        ? HRDepartmentState.data.find((item) => item.name === department)
        : null

    useEffect(() => {
        if (HRDepartmentState.fetchData) {
            dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
        }

        if (HRDepartmentState.error.status) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `${HRDepartmentState.error.message}`,
            })
        }

        if (HRDepartmentState.success.status) {
            toast({
                title: <p className="text-xl m-1">Success!</p>,
                description: <div className="flex justify-center items-center gap-2">
                    <img src="../../src/assets/HR-Dashboard/correct.png" alt="" className="w-6" />
                    <p className="font-bold">{HRDepartmentState.success.message}</p>
                </div>,
            })
        }

    }, [HRDepartmentState.fetchData, HRDepartmentState.error, HRDepartmentState.success])


    useEffect(() => {
        dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
    }, [])


    if (HRDepartmentState.isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="flex flex-col gap-4 bg-blue-50 min-[250px]:p-1 sm:p-4 rounded-lg h-[100%] overflow-auto">
            <div className="Dropdown-container flex justify-between items-center">
                <div className="drop-down-select flex items-center gap-2 min-[250px]:flex-col sm:flex-row">
                    <h1 className="font-bold sm:text-sm lg:text-lg min-[250px]:hidden sm:flex">Department : </h1>
                    <ComboDropDown DepartmentData={departments} CurrentDepartment={department} SetCurrentDepartment={setdepartment} />
                </div>
                <div className="update-delete-department">
                    {department !== "All Departments" && selectedDepartment ?
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button className="bg-blue-700 hover:bg-blue-900">
                                    <img src="../../src/assets/HR-Dashboard/settings.png" alt="" className="w-5" />
                                    <span className="min-[250px]:hidden sm:flex">Settings</span></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col justify-center items-center p-2">
                                <div className="buttons flex flex-col gap-2">
                                    <EditDepartmentDialog Department={selectedDepartment} />
                                    <DeleteDepartmentDialog Department={selectedDepartment} SetCurrentDepartment={setdepartment} />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> : null}
                </div>
            </div>
            <div className={`department-container min-[250px]:px-1 sm:px-4 rounded-lg flex flex-col gap-4 h-[100%]`}>
                {
                    department === "All Departments" ? <AllDepartments DepartmentData={HRDepartmentState} SetCurrentDepartment={setdepartment} /> :
                        <DepartmentContent CurrentDepartmentData={selectedDepartment} />
                }
            </div>
        </div>

    )
}


export const ComboDropDown = ({ DepartmentData, CurrentDepartment, SetCurrentDepartment }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="combobox-content">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-auto justify-between"
                    >
                        {CurrentDepartment}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Command>
                        <CommandInput placeholder="Search Departments..." />
                        <CommandList>
                            <CommandEmpty>No Departments found.</CommandEmpty>
                            <CommandGroup className="sm:text-sm lg:text-lg">
                                {DepartmentData.map((department) => (
                                    <CommandItem
                                        key={department.value}
                                        value={department.value}
                                        onSelect={(currentValue) => {
                                            SetCurrentDepartment(currentValue === CurrentDepartment ? "All Departments" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                CurrentDepartment === department.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {department.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}


export const DepartmentContent = ({ CurrentDepartmentData }) => {
    const table_headings_employees = ["Full Name", "Email", "Contact Number", "Remove Employee"]
    const table_headings_notice = ["Title", "Audience", "Createdby", "View Notice"]
    const departmentInfo = CurrentDepartmentData || {}
    const employeeCount = Array.isArray(departmentInfo.employees) ? departmentInfo.employees.length : 0
    const noticeCount = Array.isArray(departmentInfo.notice) ? departmentInfo.notice.length : 0

    return (
        <>
            <div className="department-heading-description flex flex-col gap-4 min-[250px]:items-center sm:items-start">
                <h1 className="font-bold min-[250px]:text-xl sm:text-2xl lg:text-4xl">{departmentInfo.name || "Department"}</h1>
                <p className="font-bold min-[250px]:text-xs sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start">
                    {departmentInfo.description || "No description available"}
                </p>
            </div>
            <Tabs defaultValue="account" className="w-full h-[100%]">
                <div className="tabs-with-button flex justify-between items-center min-[250px]:flex-col-reverse sm:flex-row">
                    <TabsList className="min-[250px]:max-w-[250px] md:max-w-[300px] bg-blue-200 text-blue-700 my-3 min-[250px]:flex min-[250px]:flex-col min-[250px]:py-14 min-[350px]:flex min-[350px]:flex-row min-[350px]:py-6">
                        <TabsTrigger value="account" className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm">
                            <span className="text-blue-700">{employeeCount} Employees</span>
                        </TabsTrigger>
                        <TabsTrigger value="password" className="px-4 py-2 font-bold m-2 min-[250px]:text-xs md:text-sm">
                            <span className="text-blue-700">{noticeCount} Notice</span>
                        </TabsTrigger>
                    </TabsList>
                    <div className="edd-employees-dialog-box">
                        <EmployeesIDSDialogBox DepartmentID={departmentInfo.id} />
                    </div>
                </div>
                <TabsContent value="account" className={`border-2 border-blue-500 rounded-lg min-[250px]:h-[100%] md:h-[85%] min-[1650px]:h-[90%] overflow-auto p-2`}>
                    <HeadingBar table_layout={"grid-cols-4"} table_headings={table_headings_employees} />
                    <DepartmentListItems TargetedState={departmentInfo} />
                </TabsContent>
                <TabsContent value="password" className={`border-2 border-blue-500 rounded-lg min-[250px]:h-[100%] md:h-[85%] min-[1650px]:h-[90%] overflow-auto p-2`}>
                    <HeadingBar table_layout={"grid-cols-4"} table_headings={table_headings_notice} />
                </TabsContent>
            </Tabs>
        </>
    )
}


export const AllDepartments = ({ DepartmentData, SetCurrentDepartment }) => {
    return (
        <>
            {DepartmentData.data ? DepartmentData.data.map((department) => <div key={department.id} className="department-data border-2 border-blue-700 p-4 rounded-lg flex flex-col gap-4">
                <div className="department-heading-description flex justify-between items-center min-[250px]:items-center sm:items-start">
                    <h1 className="font-bold min-[250px]:text-xl sm:text-2xl lg:text-4xl">{department.name}</h1>
                    <Button className="bg-blue-700 border-2 border-blue-700 text-white font-bold hover:bg-white hover:text-blue-700" onClick={() => SetCurrentDepartment(department.name)}>View</Button>
                </div>
                <p className="font-bold min-[250px]:text-xs  sm:text-sm lg:text-lg min-[250px]:text-center sm:text-start">
                    {department.description}
                </p>
            </div>) : null}
        </>
    )
}


const EditDepartmentDialog = ({ Department }) => {
    const dispatch = useDispatch()
    const [formdata, setformdata] = useState({
        name: Department.name,
        description: Department.description || "",
    })

    useEffect(() => {
        setformdata({
            name: Department.name,
            description: Department.description || "",
        })
    }, [Department])

    const updateDepartment = () => {
        dispatch(HandlePatchHRDepartments({
            apiroute: "UPDATE",
            data: {
                departmentID: Department.id,
                UpdatedDepartment: formdata,
            },
        }))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 text-white font-bold text-sm hover:bg-blue-900">
                    <img src="../../src/assets/HR-Dashboard/update.png" alt="" className="w-5" />
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold">Edit Department</h2>
                    <input
                        className="border-2 border-gray-700 rounded px-2 py-1"
                        value={formdata.name}
                        onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
                        placeholder="Department Name"
                    />
                    <textarea
                        className="border-2 border-gray-700 rounded px-2 py-1 h-[100px]"
                        value={formdata.description}
                        onChange={(e) => setformdata({ ...formdata, description: e.target.value })}
                        placeholder="Department Description"
                    />
                    <DialogClose asChild>
                        <Button className="bg-blue-700 hover:bg-blue-900" onClick={updateDepartment}>Save</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const DeleteDepartmentDialog = ({ Department, SetCurrentDepartment }) => {
    const dispatch = useDispatch()

    const deleteDepartment = () => {
        dispatch(HandleDeleteHRDepartments({
            apiroute: "DELETE",
            data: {
                departmentID: Department.id,
                action: "delete-department",
            },
        }))
        SetCurrentDepartment("All Departments")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-red-700 text-white font-bold text-sm hover:bg-red-900">
                    <img src="../../src/assets/HR-Dashboard/delete.png" alt="" className="w-5" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-lg font-bold min-[250px]:text-center">Are you sure you want to delete {Department.name} department?</p>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button className="bg-red-700 border-red-700 hover:bg-transparent hover:text-red-700" onClick={deleteDepartment}>Delete</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button className="bg-green-700 border-green-700 hover:bg-transparent hover:text-green-700">Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
