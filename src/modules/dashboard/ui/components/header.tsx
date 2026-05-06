import { Brand } from "./brand";

export const Header = () => {
	return (
		<header className="bg-card border-b py-2">
			<div className="mx-auto flex items-center justify-between gap-6 px-4 py-0 sm:px-6">
				<div className="flex items-center gap-4">
					<Brand />
					<span className="text-3xl text-muted-foreground/25">/</span>
					{/* <Breadcrumb className="hidden sm:block">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Free</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb> */}
				</div>
				<div className="flex items-center gap-1.5">
					{/* <LanguageDropdown
						trigger={
							// <Button variant="ghost" size="icon">
							// 	<LanguagesIcon />
							// </Button>
						}
					/> */}
				</div>
			</div>
		</header>
	);
};
