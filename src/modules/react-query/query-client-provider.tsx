"use client";

import React from "react";
import { QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./query-client";

const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		<_QueryClientProvider client={getQueryClient()}>
			{children}
		</_QueryClientProvider>
	);
};

export default QueryClientProvider;
