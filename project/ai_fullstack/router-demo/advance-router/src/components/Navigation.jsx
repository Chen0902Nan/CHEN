import { Link, useResolvedPath, useMatch } from "react-router-dom";
export default function Navigation() {
  const isActive = (to) => {
    const resolvedPath = useResolvedPath(to); // to解析为Location对象
    const match = useMatch({
      path: resolvedPath.pathname,
      // 精准匹配
      end: true,
    });
    // console.log(to, match, "////////");

    return match ? "active" : "";
  };
  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={isActive("/about")}>
            About
          </Link>
        </li>
        <li>
          <Link to="/products" className={isActive("/products")}>
            Product
          </Link>
        </li>
        <li>
          <Link to="/products/new" className={isActive("/products/new")}>
            Product New
          </Link>
        </li>
        <li>
          <Link to="/products/123" className={isActive("/products/123")}>
            Product Detail
          </Link>
        </li>
        <li>
          <Link to="/pay" className={isActive("/pay")}>
            Pay
          </Link>
        </li>
        <li>
          <Link to="/old-path" className={isActive("/old-path")}>
            old-path
          </Link>
        </li>
      </ul>
    </nav>
  );
}
