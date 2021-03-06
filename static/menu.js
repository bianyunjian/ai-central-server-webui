
window.MENU_CONFIG = [
    {
        index: "1",
        name: "设备管理",
        icon: "el-icon-box",
        menuItems: [
            {
                index: "1-1",
                name: "设备列表",
                routeName: "DeviceManage",

            }
        ]
    },
    {
        index: "2",
        name: "摄像头管理",
        icon: "el-icon-camera",
        menuItems: [
            {
                index: "2-1",
                name: "摄像头列表",
                routeName: "CameraManage",

            }
        ]
    },
    {
        index: "3",
        name: "AI管理",
        icon: "el-icon-cpu",
        menuItems: [
            {
                index: "3-1",
                name: "算法匹配",
                routeName: "AiConfigManage"
            }
        ]
    },
    {
        index: "4",
        name: "系统配置",
        icon: "el-icon-setting",
        menuItems: [
            {
                index: "4-1",
                name: "人脸库管理",
                routeName: "FaceManage"
            },
            {
                index: "4-2",
                name: "运行时设置",
                routeName: "RuntimeManage"
            }
        ]
    },
    {
        index: "5",
        name: "数据查询",
        icon: "el-icon-timer",
        menuItems: [
            {
                index: "5-1",
                name: "实时数据查询",
                routeName: "RealtimeDataTable"
            },
            {
                index: "5-2",
                name: "历史数据查询",
                routeName: "HistoryDataTable"
            }
        ]
    }
];
console.log("window.MENU_CONFIG=", window.MENU_CONFIG);
