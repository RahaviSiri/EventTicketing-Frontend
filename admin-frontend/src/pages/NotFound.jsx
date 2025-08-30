const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: "hsl(var(--foreground))" }}
        >
          404
        </h1>
        <p
          className="text-lg mb-4"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Oops! Page not found
        </p>
        <a
          href="/"
          className="underline transition-colors"
          style={{ color: "hsl(var(--primary))" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = "hsl(var(--primary-hover))")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "hsl(var(--primary))")
          }
        >
          Return to Admin Portal
        </a>
      </div>
    </div>
  );
};

export default NotFound;
