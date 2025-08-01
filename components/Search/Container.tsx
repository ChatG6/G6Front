import { FC, ReactNode } from 'react';

// The props interface is updated to include an optional `className`.
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  // The passed `className` is combined with the default "container" class.
  const combinedClassName = `container ${className || ''}`.trim();

  return (
    <>
      <div className={combinedClassName}>
        {children}
      </div>
    </>
  );
};

export default Container;