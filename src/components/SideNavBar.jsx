import React from 'react';
import {
	Bike,
	Building,
	ChevronRight,
	ClipboardList,
	Cog,
	LayoutDashboard, LogOut, Paperclip,
	Plus
} from 'lucide-react';
import { useState } from 'react';
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton, SidebarFooter, SidebarHeader, SidebarContent
} from '@/components/ui/sidebar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
import { api } from '@/app/services/api.js';
import { Button } from '@/components/ui/button.jsx';

// Menu items
const items = [
	{
		type: 'simple',
		title: 'Dashboard',
		to: '/',
		icon: LayoutDashboard
	},
	{
		type: 'simple',
		title: 'Orders',
		to: '/orders',
		icon: Paperclip
	},
	{
		type: 'extended',
		title: 'Parts',
		icon: Cog,
		children: [
			{
				title: 'Part list',
				to: '/parts',
				icon: ClipboardList
			},
			{
				title: 'Add part',
				to: '/parts/add',
				icon: Plus
			}
		]
	},
	{
		type: 'extended',
		title: 'Models',
		icon: Bike,
		children: [
			{
				title: 'Model List',
				to: '/models',
				icon: ClipboardList
			},
			{
				title: 'Add model',
				to: '/models/add',
				icon: Plus
			}
		]
	},
	{
		type: 'extended',
		title: 'Brands',
		icon: Building,
		children: [
			{
				title: 'Brand list',
				to: '/brands',
				icon: ClipboardList
			},
			{
				title: 'Add brand',
				to: '/brands/add',
				icon: Plus
			}
		]
	}
];

export function SideNavBar() {
	const [openItems, setOpenItems] = useState(new Set());

	const toggleItem = (title) => {
		setOpenItems((prev) => {
			const next = new Set(prev);
			if (next.has(title)) {
				next.delete(title);
			} else {
				next.add(title);
			}
			return next;
		});
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<img src="/AnemosParts_Logo.svg" alt="Logo" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								if (item.type === 'simple') {
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<Link to={item.to}>
													<item.icon className="h-4 w-4" />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								}

								if (item.type === 'extended') {
									const isOpen = openItems.has(item.title);

									return (
										<Collapsible
											key={item.title}
											open={isOpen}
											onOpenChange={() => toggleItem(item.title)}
											className="group/collapsible"
										>
											<SidebarMenuItem>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton className="cursor-pointer">
														<item.icon className="h-4 w-4" />
														<span>{item.title}</span>
														<ChevronRight
															className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.children.map((child) => (
															<SidebarMenuSubItem key={child.title}>
																<SidebarMenuSubButton asChild>
																	<Link to={child.to}>
																		<child.icon className="h-4 w-4" />
																		<span>{child.title}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											</SidebarMenuItem>
										</Collapsible>
									);
								}
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Button variant="secondary" onClick={async () => {
					await api.delete('/auth');
				}} asChild>
					<Link to="/login">
						<LogOut className="h-4 w-4" />
						<span>Log out</span>
					</Link>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
