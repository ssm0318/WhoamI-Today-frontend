import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  // TODO
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>{error.status} Error Page</h1>
        <p>
          <i>{error.statusText}</i>
        </p>
      </>
    );
  }

  return <h1>Unknown Error Page</h1>;
}

export default ErrorPage;
