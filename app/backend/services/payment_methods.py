import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.payment_methods import Payment_methods

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Payment_methodsService:
    """Service layer for Payment_methods operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Payment_methods]:
        """Create a new payment_methods"""
        try:
            obj = Payment_methods(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created payment_methods with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating payment_methods: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Payment_methods]:
        """Get payment_methods by ID"""
        try:
            query = select(Payment_methods).where(Payment_methods.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching payment_methods {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of payment_methodss"""
        try:
            query = select(Payment_methods)
            count_query = select(func.count(Payment_methods.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Payment_methods, field):
                        query = query.where(getattr(Payment_methods, field) == value)
                        count_query = count_query.where(getattr(Payment_methods, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Payment_methods, field_name):
                        query = query.order_by(getattr(Payment_methods, field_name).desc())
                else:
                    if hasattr(Payment_methods, sort):
                        query = query.order_by(getattr(Payment_methods, sort))
            else:
                query = query.order_by(Payment_methods.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching payment_methods list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Payment_methods]:
        """Update payment_methods"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Payment_methods {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated payment_methods {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating payment_methods {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete payment_methods"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Payment_methods {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted payment_methods {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting payment_methods {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Payment_methods]:
        """Get payment_methods by any field"""
        try:
            if not hasattr(Payment_methods, field_name):
                raise ValueError(f"Field {field_name} does not exist on Payment_methods")
            result = await self.db.execute(
                select(Payment_methods).where(getattr(Payment_methods, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching payment_methods by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Payment_methods]:
        """Get list of payment_methodss filtered by field"""
        try:
            if not hasattr(Payment_methods, field_name):
                raise ValueError(f"Field {field_name} does not exist on Payment_methods")
            result = await self.db.execute(
                select(Payment_methods)
                .where(getattr(Payment_methods, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Payment_methods.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching payment_methodss by {field_name}: {str(e)}")
            raise