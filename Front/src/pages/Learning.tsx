import DepartmentList from "../components/Schedule/DepartmentList";
import { useScheduleDataStore } from "../store/schedule/useScheduleDataStore";

const topics = [
    {  
    id: 1,
    name: 'برنامه نویسی',
    instructors_count: 1,
    courses_count: 1
    },
    {  
    id: 2,
    name: 'ریاضی',
    instructors_count: 1,
    courses_count: 1
    },
];

export const LearningHub = () => {
    //   const {
    //     departments,
    //     isLoadingDepartments,
    //     selectedDept,
    //     setSelectedDept,
    //   } = useScheduleDataStore()
    return(
        <section className="flex justify-center items-center align-middle">
            {/* <div className="mb-1 sm:mb-4">
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={isLoadingDepartments}
          />
        </div> */}
            <a href="https://parsabordbar.github.io/get-git/">
                <div className="bg-[#F75B2B] px-10 py-16 my-10 rounded-xl border-black border-[2px] border-b-8">
                    <h2 className="bold text-lg font-semibold">فعلا فقط می‌تونی گیت و گیت‌هاب یادبگیری </h2>
                </div>
            </a>
        </section>
    )
};
