import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.stock_adjustments import Stock_adjustments

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Stock_adjustmentsService:
    """Service layer for Stock_adjustments operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any], user_id: Optional[str] = None) -> Optional[Stock_adjustments]:
        """Create a new stock_adjustments"""
        try:
            if user_id:
                data['user_id'] = user_id
            obj = Stock_adjustments(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created stock_adjustments with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating stock_adjustments: {str(e)}")
            raise

    async def check_ownership(self, obj_id: int, user_id: str) -> bool:
        """Check if user owns this record"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            return obj is not None
        except Exception as e:
            logger.error(f"Error checking ownership for stock_adjustments {obj_id}: {str(e)}")
            return False

    async def get_by_id(self, obj_id: int, user_id: Optional[str] = None) -> Optional[Stock_adjustments]:
        """Get stock_adjustments by ID (user can only see their own records)"""
        try:
            query = select(Stock_adjustments).where(Stock_adjustments.id == obj_id)
            if user_id:
                query = query.where(Stock_adjustments.user_id == user_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching stock_adjustments {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        user_id: Optional[str] = None,
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of stock_adjustmentss (user can only see their own records)"""
        try:
            query = select(Stock_adjustments)
            count_query = select(func.count(Stock_adjustments.id))
            
            if user_id:
                query = query.where(Stock_adjustments.user_id == user_id)
                count_query = count_query.where(Stock_adjustments.user_id == user_id)
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Stock_adjustments, field):
                        query = query.where(getattr(Stock_adjustments, field) == value)
                        count_query = count_query.where(getattr(Stock_adjustments, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Stock_adjustments, field_name):
                        query = query.order_by(getattr(Stock_adjustments, field_name).desc())
                else:
                    if hasattr(Stock_adjustments, sort):
                        query = query.order_by(getattr(Stock_adjustments, sort))
            else:
                query = query.order_by(Stock_adjustments.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching stock_adjustments list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any], user_id: Optional[str] = None) -> Optional[Stock_adjustments]:
        """Update stock_adjustments (requires ownership)"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            if not obj:
                logger.warning(f"Stock_adjustments {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key) and key != 'user_id':
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated stock_adjustments {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating stock_adjustments {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int, user_id: Optional[str] = None) -> bool:
        """Delete stock_adjustments (requires ownership)"""
        try:
            obj = await self.get_by_id(obj_id, user_id=user_id)
            if not obj:
                logger.warning(f"Stock_adjustments {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted stock_adjustments {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting stock_adjustments {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Stock_adjustments]:
        """Get stock_adjustments by any field"""
        try:
            if not hasattr(Stock_adjustments, field_name):
                raise ValueError(f"Field {field_name} does not exist on Stock_adjustments")
            result = await self.db.execute(
                select(Stock_adjustments).where(getattr(Stock_adjustments, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching stock_adjustments by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Stock_adjustments]:
        """Get list of stock_adjustmentss filtered by field"""
        try:
            if not hasattr(Stock_adjustments, field_name):
                raise ValueError(f"Field {field_name} does not exist on Stock_adjustments")
            result = await self.db.execute(
                select(Stock_adjustments)
                .where(getattr(Stock_adjustments, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Stock_adjustments.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching stock_adjustmentss by {field_name}: {str(e)}")
            raise