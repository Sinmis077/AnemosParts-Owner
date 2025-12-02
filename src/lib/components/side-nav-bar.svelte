<script>
	import {
		Bike,
		Building,
		ChevronRight,
		ClipboardList,
		Cog,
		LayoutDashboard,
		Plus
	} from 'lucide-svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Collapsible } from 'bits-ui';

	// Menu items
	const items = [
		{
			type: 'simple',
			title: 'Dashboard',
			to: '/',
			icon: LayoutDashboard
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

	let openItems = new Set();

	function toggleItem(title) {
		const next = new Set(openItems);
		if (next.has(title)) {
			next.delete(title);
		} else {
			next.add(title);
		}
		openItems = next;
	}
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						{#if item.type === 'simple'}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton asChild>
									{#snippet child({ props })}
										<a href={item.to} {...props}>
											<svelte:component this={item.icon} />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{:else if item.type === 'extended'}
							<Collapsible.Root
								open={openItems.has(item.title)}
								onOpenChange={() => toggleItem(item.title)}
							>
								<Sidebar.MenuItem>
									<Collapsible.Trigger class="w-full">
										<Sidebar.MenuButton class="cursor-pointer">
											<svelte:component this={item.icon} />
											<span>{item.title}</span>
											<ChevronRight
												class="ml-auto transition-transform duration-200 {openItems.has(item.title)
													? 'rotate-90'
													: ''}"
											/>
										</Sidebar.MenuButton>
									</Collapsible.Trigger>
									<Collapsible.Content>
										<Sidebar.MenuSub>
											{#each item.children as subItem (subItem.title)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton asChild>
														{#snippet child({ props })}
															<a href={subItem.to} {...props}>
																<svelte:component this={subItem.icon} />
																<span>{subItem.title}</span>
															</a>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									</Collapsible.Content>
								</Sidebar.MenuItem>
							</Collapsible.Root>
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>