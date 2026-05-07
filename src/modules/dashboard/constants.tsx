import { FaUsers } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export const organizationSidebar: Sidebar.SidebarGroup[] = [
	{
		label: "Organization",
		items: [
			{ label: "Workspaces / teams", url: "", Icon: <BsPersonWorkspace /> },
			{ label: "People", url: "", Icon: <FaUsers /> },
			// { label: "Billing", url: "" },
			// { label: "Integrations", url: "" },
			{ label: "Settings", url: "", Icon: <IoSettingsOutline /> },
			// { label: "", url: "" },
		],
	},
];
