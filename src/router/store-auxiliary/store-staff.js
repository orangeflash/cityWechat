const StoreStaffContainer = () => import("@/pages/store-auxiliary/store-staff/container")
const StoreStaffManger = () => import("@/pages/store-auxiliary/store-staff/index")
const StoreStaffAdd = () => import("@/pages/store-auxiliary/store-staff/add")
const StoreStaffUpdate = () => import("@/pages/store-auxiliary/store-staff/update")


export const storeStaffRouter = {
  path: 'storeStaff',
  component: StoreStaffContainer,
  children: [
    {
      meta: {title: "员工管理", defaultTab: true,},
      path: "/",
      name: "StoreActivityMy",
      component: StoreStaffManger
    },{
      meta: {title: "添加员工", defaultTab: true, needJsSdk: true},
      path: "add",
      name: "StoreStaffAdd",
      component: StoreStaffAdd
    },{
      meta: {title: "修改信息", defaultTab: true, needJsSdk: true},
      path: "update",
      name: "StoreStaffUpdate",
      component: StoreStaffUpdate
    }
  ]
}
