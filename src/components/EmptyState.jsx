import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from './ApperIcon';

const EmptyState = ({ title, description, actionLabel, onAction, actionLink }) => {
  const ActionComponent = actionLink ? NavLink : 'button';
  const actionProps = actionLink ? { to: actionLink } : { onClick: onAction };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <ApperIcon name="Package" size={64} className="text-gray-300 mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">{description}</p>
      
      {(onAction || actionLink) && actionLabel && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ActionComponent
            {...actionProps}
            className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            {actionLabel}
          </ActionComponent>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;