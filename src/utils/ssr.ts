export const serverGetSSRData = async <T>(fn: () => Promise<T>) => {
  try {
    const data = await fn();
    return {
      data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error,
    };
  }
};
