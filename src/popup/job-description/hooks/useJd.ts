import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProcessedJobDescription, API_BASE_URL } from "@/lib/api";
import { formatPageHtmlError, getActiveTabPageContext } from "@/lib/active-tab";
import { usePopupStore } from "@/store/use-popup-store";

export function useJd() {
  const jobDescription = usePopupStore((state) => state.jobDescription);
  const jobDescriptionStatus = usePopupStore(
    (state) => state.jobDescriptionStatus,
  );
  const jobDescriptionError = usePopupStore((state) => state.jobDescriptionError);
  const setJobDescriptionLoading = usePopupStore(
    (state) => state.setJobDescriptionLoading,
  );
  const setJobDescriptionReady = usePopupStore((state) => state.setJobDescriptionReady);
  const setJobDescriptionError = usePopupStore((state) => state.setJobDescriptionError);
  const [isReadingPageHtml, setIsReadingPageHtml] = useState(false);
  const {
    data,
    error,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["processed-job-description"],
    queryFn: async () => {
      setIsReadingPageHtml(true);

      let pageContext;

      try {
        pageContext = await getActiveTabPageContext({ includeHtml: true });
      } catch (error) {
        throw new Error(formatPageHtmlError(error));
      } finally {
        setIsReadingPageHtml(false);
      }

      return getProcessedJobDescription({
        pageHtml: pageContext.pageHtml,
        job_url: pageContext.pageUrl,
        page_title: pageContext.pageTitle,
      });
    },
    staleTime: Infinity,
  });
  const isProcessingJobDescription = isPending || isFetching;

  useEffect(() => {
    if (isProcessingJobDescription) {
      setJobDescriptionLoading();
      return;
    }

    if (data?.jobDescription) {
      setJobDescriptionReady({
        jobDescription: data.jobDescription,
        pageTitle: data.pageTitle,
        pageUrl: data.pageUrl,
      });
      return;
    }

    if (error instanceof Error) {
      setJobDescriptionError(error.message);
    }
  }, [
    data?.jobDescription,
    data?.pageTitle,
    data?.pageUrl,
    error,
    isProcessingJobDescription,
    setJobDescriptionError,
    setJobDescriptionLoading,
    setJobDescriptionReady,
  ]);

  return {
    endpoint: `${API_BASE_URL}/api/job-description/process`,
    isProcessingJobDescription,
    isReadingPageHtml,
    isRetryDisabled: isProcessingJobDescription,
    isRetrying: isProcessingJobDescription,
    jobDescription,
    jobDescriptionError,
    jobDescriptionStatus,
    retry: () => {
      void refetch();
    },
  };
}
