import React, { useState } from "react";
import { UploadIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { organization_insert_schema } from "../../validations";
import { authClient } from "@/lib/authClient";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

type FormValues = {
	name: string;
	slug: string;
};

interface Props {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const OrganizationCreateDiaog = ({ open, onOpenChange }: Props) => {
	const [isOpen, setIsOpen] = useState(open);

	const form = useForm<FormValues>({
		defaultValues: {
			name: "",
			slug: "",
		},
		resolver: zodResolver(
			organization_insert_schema.pick({
				name: true,
				slug: true,
			}),
		),
	});

	const onSubmit = async ({ name, slug }: FormValues) => {
		const { data, error } = await authClient.organization.create({
			name,
			slug,
			keepCurrentActiveOrganization: true,
		});
		if (error) {
			toast.error(error.message);
		} else if (data) {
			toast.success(`${name} organization created`);
			handleOnOpenChange(false);
			// TODO: what to do after creation of a new organization
		}
	};

	const handleOnOpenChange = (open: boolean) => {
		setIsOpen(open);
		onOpenChange?.(open);
	};

	return (
		<Dialog modal open={isOpen} onOpenChange={handleOnOpenChange}>
			<DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-y-8"
				>
					<DialogHeader>
						<DialogTitle>Create organization</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-3">
						<Label>Logo</Label>
						<div className="flex items-center gap-x-5">
							<div className="group size-16 bg-background flex items-center justify-center border border-dashed border-primary/40 rounded-md cursor-pointer ">
								<UploadIcon className="size-4 text-muted-foreground group-hover:scale-120 transition-all ease-in-out duration-100" />
							</div>
							<div className="space-y-2">
								<Button variant={"outline"} className="cursor-pointer">
									Upload
								</Button>
								<p className="text-xs text-muted-foreground">
									Recommended size 1:1, up to 10 MB
								</p>
							</div>
						</div>
					</div>
					<Controller
						control={form.control}
						name="name"
						render={({
							field: { name, onBlur, onChange, value, disabled },
						}) => {
							return (
								<Field>
									<FieldLabel>Name</FieldLabel>
									<InputGroup>
										<InputGroupInput
											name={name}
											onBlur={onBlur}
											onChange={onChange}
											value={value}
											placeholder="Organization name"
											disabled={disabled}
										/>
									</InputGroup>
								</Field>
							);
						}}
					/>

					<Controller
						control={form.control}
						name="slug"
						render={({
							field: { name, onBlur, onChange, value, disabled },
						}) => {
							return (
								<Field>
									<FieldLabel>Slug</FieldLabel>
									<InputGroup>
										<InputGroupInput
											name={name}
											onBlur={onBlur}
											onChange={onChange}
											value={value}
											placeholder="Organization name"
											disabled={disabled}
										/>
									</InputGroup>
								</Field>
							);
						}}
					/>

					<DialogFooter>
						<Button
							type="submit"
							variant={"default"}
							className="cursor-pointer w-max ms-auto"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting && <Spinner />}
							{form.formState.isSubmitting ? "Creating..." : "Create workspace"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
